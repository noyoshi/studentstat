const express = require("express");
const app = express();
const cors = require("cors");
const si = require("systeminformation");
const bytes = require("bytes");

const port = 9090;
const host = "0.0.0.0";

let parse_mem_data = data => {
  return {
    total: bytes(data.total),
    available: bytes(data.used),
    active: bytes(data.active)
  };
};

let filter_procs = data => {
  num_vscode = 0;
  return {
    data: data.list.map(proc => {
      let flagged_string = ".vscode-server";
      // let flagged_string = "node";
      if (proc.command.includes(flagged_string)) {
        num_vscode += 0.5; // Technically each instance will have 2 procs going?
      }

      return {
        user: proc.user,
        mem: proc.pmem,
        name: proc.name,
        state: proc.state,
        cmd: proc.command,
        cpu: proc.pcpu
      };
    }),
    vscode: Math.round(num_vscode) // In case we are off
  };
};

let filter_load = data => {
  return {
    all: data.cpus.map(cpu => {
      return `${Math.round(cpu.load)}%`;
    }),
    current: `${Math.round(data.currentload)}%`
  };
};

si.processes().then(data => console.log(filter_procs(data).length));
si.currentLoad().then(data => console.log(filter_load(data)));

app.get("/", cors(), function(req, res) {
  si.mem().then(data => {
    si.processes().then(proc_data => {
      si.currentLoad().then(load_data => {
        filered_procs = filter_procs(proc_data);
        res.send({
          mem: parse_mem_data(data),
          num_procs: filered_procs.data.length,
          load: filter_load(load_data),
          vscode: filered_procs.vscode
        });
      });
    });
  });
});

app.listen(port, host, () =>
  console.log(`Example app listening on port ${port} on host ${host}`)
);
