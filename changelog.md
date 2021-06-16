# Unreleased

Add support for React 17.

# 2.0.0

BREAKING: To make compatible with React 17, we got rid of componentWillReceiveProps usage. In doing so,
we also took the time to simplify the API to MapInteraction to just require `value` and `onChange` when
you want to control the component, instead of `scale`, `translation`, and `onChange`. The minimum React
peer dependency is now 16.3.

See #39

# 1.3.1

### Fix issue of contents changing translation when dragging outside of container.
This bug can be reproduced by a) Perform a normal drag inside of the container, then b) Drag somewhere outside of the container, which should have no impact on the translation of the contents, however you will see that the contents will change translation.

### Fix #20.

# Versions 1.3.0 and earlier do not yet have entries in the changelog.
