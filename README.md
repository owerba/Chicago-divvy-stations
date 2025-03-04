# Chicago Divvy Stations Project

Summary: Final project for Web Development (Spring 2024). Create an interactive web page that utilizes user location and real-time Chicago Divvy bike data to allow users to view station availability by nearest location. 

File Overview:

1. divvy.css: provides CSS for stations, favorites bar, and other important elements on the web page.
2. divvy.html: provides HTML for content and structure of web page
3. divvy.js: manages state and interactivity for the web page
4. styles.css: second style sheet







Assignment Criteria Below
----------



Total Points: 20

Due: Wednesday May 15, 2:30pm

The aims of this assignment are:

1. To ensure your JS skills have gained proficiency
2. To verify that our tour of React has helped you think about state and overall modularity, even in non-React code


### The Challenge

For this assignment, we will revisit our "Divvy" example from Week 4.

Notes about the code:

* In the navbar, I've provided links to the official Divvy API endpoints.  Click them to get a preview of the data you can retrieve.
* I've already provided an example of a "station card" that you can use as a template for all station information.  
* You SHOULD change as much of the HTML and CSS as you want.  For example, you may want to convert the existing station card example into a `<template>`
* You MAY convert this project into a React application if you prefer.  In that case, create a subfolder called `react-divvy` to contain your app, and you can copy code from these files as you please. This is not required.

HINT: You will need to research `localStorage` and how it works.

**REQUIREMENTS (20 points):**

Each feature below is worth 5 points. Solve them in any order that you feel best.

1. Implement the "Display All Stations" button.  This should fill the screen with station cards, one for each Divvy station that exists. You do NOT have to display the "Distance" or "Availability" in this situation.  Just display the station name and total capacity.

2. Implement the "Nearest 5 stations" button.  This should fill the screen with 5 station cards, one for each Divvy station nearest the user's current location. The cards should be in sorted order, from nearest to furthest.  You must also display the distance and real-time bike availability at that station.

3. Implement the "Add to Favorites" button.  Clicking this button should add this station to a list of favorites somewhere on the screen.  Using `localStorage`, make the list of favorites persist even if you refresh the page.  When the page is reffreshed and favorites exist in local storage, you should retrieve the real-time status for each favorite station to display the real-time bike availability at the station. (You do not need to display the distance).

4. Implement a "Remove from Favorites" button on stations that have already been added to the favorites section.  

**GRADING RUBIC**

For requirements #1, #2, and #4, up to 5 points for correct functionality.

For requirement #3:
* Up to 3 pts for correct functionality
* Up to 2 pts for appealing UI for the favorites list








