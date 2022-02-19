# Crash Dummies 2.0 - Car Accident Analysis 🚗

## Team Members: Arnold Wamulanga, Thomas Lawless, Shreya Udeshi 

## Background 🌎

The goal with this project is to create a map of all accidents across the U.S., and then create a bin for age-adjusted accidents. The user can then select any part of the map and see what the distribution of accidents is by age for the region selected.

![Crash Dummies](/accident_report/images/1.gif)

**Source of Data:** 

* [NHSTA - US Department of Transportation](https://www.nhtsa.gov/file-downloads?p=nhtsa/downloads/CRSS/2019/)
* [Fatal Motor Vehicle Accidents](https://data-usdot.opendata.arcgis.com/datasets/usdot::fatal-motor-vehicle-accidents/)

### Requirements 👩🏻‍💻

1. Scripting: *Python Scripting, Java Scripting*
2. SQL: *PostgresSQL*
3. Libraries used: *pandas, sqlalchemy, flask, psycopg2, json*
4. Notebook: *Jupyter Notebook*
5. *Flask API*
6. *Leaflet, GeoJSON*

![Coder](/accident_report/images/2.gif)

## Accomplishments 🎯

1. Extracted and cleaned datasets -> *accidents, person & vehicle*

![Accidents](/accident_report/images/accidents.png)

![People](/accident_report/images/people.png)

![Vehicle](/accident_report/images/vehicle.png)

2. Loaded the datasets on PGAdmin as a DB

![DB](/accident_report/images/db.png)

3. Used *Flask* routes to get webpage up and running

![Flask Routes](/accident_report/images/flask.jpg)
