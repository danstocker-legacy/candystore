Candystore
==========

*Common widgets*

[Reference](http://danstocker.github.io/candystore)

Candystore implements a highly reusable set of fundamental widgets. They build on top of [shoeshine](https://github.com/danstocker/shoeshine)' Widget class, observing classical OOP imposed by [troop](https://github.com/production-minds/troop), and the document-oriented model of [bookworm](https://github.com/danstocker/bookworm). Some Candystore widgets also rely on transport-level features of [poodle](https://github.com/danstocker/poodle).

The purpose of Candystore is to provide the building blocks of front end applications' *view-controller* layer.

Candystore is agnostic about how the widgets will be used and displayed, and thus have no styling (CSS) beyond what is necessary for them to function. (Eg. a button should have a pointer cursor.)

### Basic widgets

- Label, HtmlLabel, DataLabel
- Button, TextButton
- Input, TextInput, DataTextInput, PasswordInput
- Image, DataImage
- DynamicImage, DataDynamicImage

### Composite widgets

- List, DataList
- Form, FormField

### Dropdowns

- Dropdown, DataDropdown
- DropdownButton, DataDropdownButton

### Widget behaviors:

- Popup, AlignedPopup,
- Disableable, Highlightable
- EntityWidget, FieldBound,
- Option, OptionList
