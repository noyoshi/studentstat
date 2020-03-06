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
  return data.list.map(proc => {
    return {
      user: proc.user,
      mem: proc.pmem,
      name: proc.name,
      state: proc.state,
      cmd: proc.command,
      cpu: proc.pcpu
    };
  });
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
        res.send({
          mem: parse_mem_data(data),
          num_procs: filter_procs(proc_data).length,
          load: filter_load(load_data)
        });
      });
    });
  });
});

app.listen(port, host, () =>
  console.log(`Example app listening on port ${port} on host ${host}`)
);
