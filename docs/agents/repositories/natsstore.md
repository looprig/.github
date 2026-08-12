---
id: agents/repositories/natsstore
title: NATS JetStream storage
description: Use remote NATS or an embedded JetStream engine as a storage.Composite backend.
audience: agent
section: agents/repositories
order: 15
publication: released
proofs:
  module:
    - release-github-com-looprig-natsstore
---
# natsstore

`github.com/looprig/natsstore@v0.3.1` implements the four `storage` primitives over one NATS connection and returns a `*Store` embedding `*storage.Composite`. Call `natsstore.Open(ctx, Options{URL: "nats://..."})` for a remote broker or set `EmbeddedDir` for an owned in-process JetStream server. These options are mutually exclusive. Close the store once on shutdown.

Use the returned composite with `sessionstore.Open`, `flowstore.New`, or another consumer of Ledger, Leaser, KV, and Blobs. Embedded mode owns its engine and requires one opener per directory. Remote URLs and errors are redacted before they reach diagnostics.

Invalid option combinations, path restrictions, connect, bucket wiring, lease, revision, payload, and close errors are boundary failures. Proofs: [`natsstore.go`](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/natsstore.go), [`embedded.go`](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/embedded.go), [`natsstore_test.go`](https://github.com/looprig/natsstore/blob/054dcab200c5a3d0ddde76208d3b117e76c521f2/natsstore_test.go), [`examples/embedded/example_test.go`](https://github.com/looprig/natsstore/blob/0da015f2ce6fd68015f3b4cbf875f5c841eed476/examples/embedded/example_test.go).
