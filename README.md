Candystore
==========

*Common widgets*

[Wiki](https://github.com/danstocker/candystore/wiki)

[Reference](http://danstocker.github.io/candystore)

Candystore implements a highly reusable set of fundamental widgets. They build on top of [shoeshine](https://github.com/danstocker/shoeshine)' Widget class, observing classical OOP imposed by [troop](https://github.com/production-minds/troop), and the document-oriented model of [bookworm](https://github.com/danstocker/bookworm). Some Candystore widgets also rely on transport-level features of [poodle](https://github.com/danstocker/poodle).

The purpose of Candystore is to provide the building blocks of front end applications' *view-controller* layer.

Candystore is agnostic about how the widgets will be used and displayed, and thus have no styling (CSS) beyond what is necessary for them to function. (Eg. a button should have a pointer cursor.)

Supported widgets
-----------------

![Inheritance chart](https://dl.dropboxusercontent.com/u/9258903/CodePristine/candystore%200.1.5.png)

### Basic widgets

- Label, HtmlLabel, DataLabel, ItemDataLabel
- Link, DataLink
- Button, TextButton
- Input, TextInput, DataTextInput, PasswordInput
- Image, DataImage
- DynamicImage, DataDynamicImage

### Composite widgets

- List, DataList
- Form, FormField
- Flow
- Page

### Dropdowns

- Dropdown, DataDropdown
- DropdownButton, DataDropdownButton

### Widget behaviors:

- Popup, AlignedPopup,
- BinaryStateful, Disableable, Highlightable, Expandable
- EntityWidget, FieldBound,
- Option, OptionList
- DataListItem

### Widget utilities:

- HotKeyWatcher
- ResizeWatcher

IE9
---

In order for Candystore and its dependencies to work on IE9, make sure that the browser operates in 'IE9 standards' document mode, by (conditionally) adding `<!doctype html>` and `<meta http-equiv="X-UA-Compatible" content="IE=Edge">` to the application html.

IE versions lower than 9 are not supported.
