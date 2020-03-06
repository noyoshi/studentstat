## Usage

You have to be on the ND VPN for this to work.

View student machine statuses by opening `client.html` in your web browser. Thats it!

## Running it yourself

If you want to run the monitoring program on the student machines yourself, then
you need to build node on the student machines. I would recomment using `nodenv` to do so.

On the student machines run `npm install` then `node monitor.js` in something like a tmux
session to persist it. You might need to change the port number in the program if I or someone
else is using it.
