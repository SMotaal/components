# Code Editor Elements

## Concepts

### Representation

#### Source Text

By default, code is represented in the form of source text, which reflects a string (or the stream of such) read from or written to a plain text document.

Working with code in the source text form is sufficiently suited for most text-based operations.

From a rendering position, optimization may be challenging when working with the various runtime capabilities, especially when for longer sources.

Design decisions should consider tradeoffs between the size of the source and the set of text processing features that operate directly on source text.

#### Source Document

The entire set of serializable code units for a single source is represented in the form of a document, which reflects the non-string aspects for the source and the abstractions for reading and writting to the string or strings its source text.

Working with code in the source document form is more suitable from a rendering perspective where text-based operations are abstracted away behind more flexible APIs.

In the form of a document, source code operations by a rendering element can avoid dealing with optimizations directly.

From a rendering position, it seems reasonable to assume that most designs will include two separate representations of a single source.

Design decisions should consider aspects like granuality and maintainability.

##### Virtual Document

Each source is represented in the form of a virtual document which exposes the interface needed to access and operate on fragments of the code. The exposed APIs may further be decoupled from the source text operations that are performed on the actual source.

Tradeoffs between performance and concurrency should be considered when making design decisions about the APIs exposed to other representations, ie the visual documents.

##### Visual Document

Each source is represented in the form of one or more visual documents coupled to the single virtual document instance of the source they are rendering.

Tradeoffs will need be considered when making design decisions dealing with more than one virtual document.


---

- https://developers.google.com/web/updates/2016/07/infinite-scroller
- https://clusterize.js.org/
-
