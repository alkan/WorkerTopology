# Taming Node Worker Threads

Worker Threads is a Node.js implementation of HTML5@s Web Workers specification -- with a few context specific updatesz  Altought it would be comparable to sub-processes, worker threads is ligther, more flexible and easier to manage and compose.

A multi--threaded Node application consists of a main and one or more worker processes, and and a number of channels to pair processes.  Any kind of memory tharing is not allowed to thereads.Instead, messaging channels supply a well organised, event based communication platfork amond worker/main threadds.

