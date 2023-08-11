MUI system: the basic elements and fundamentals of styling
https://mui.com/system/getting-started/overview/

MUI : the custom elements we import:
https://mui.com/material-ui/getting-started/overview/

with MUI, Just build with Boxes, whenever the ready made components are not working !

importance of key prop : never ignore that waning. its alternate to useMemo, while rendering, if key prop is NOT same as b4 , the element is completely ripped of along with all its children. but if not, only changes are applied, not complete teardown, if css is changing, only css is applied, even to the child elements.