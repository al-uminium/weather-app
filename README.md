# Revisiting weather-app 
This is a revisit of the weather app from The Odin Project :)

## Problems faced:
- There are several towns/cities that share the same name (e.g., London is being shared by UK, US and CA), so by querying "London" would not be accurate.
- USA have duplicate city names in different states. 

## Learning points:
- Learnt how to change background image dynamically (based on weather condition)
- `document.querySelectorAll` returns a static Node list, compared to `document.getElementsBy...`, which produces a live Node list.