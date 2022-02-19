import pandas as pd
from  flask import Flask, render_template
import json

def get_age_segment(age):
    if age <= 16:
        return '0-16'
    elif age <= 26:
        return '17-26'
    elif age <= 36:
        return '27-36'
    elif age <= 46:
        return '37-46'
    elif age <= 56:
        return '47-56'
    else:
        return '57+'


app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/data')
def get_data():

    # read in csv and merge on case_number
    accident_file = pd.read_csv('input/accident_final.csv')
    people_file = pd.read_csv('input/person_final.csv')
    df = accident_file.merge(people_file, how='left', on='Case_Number')
    
    # clean the dataframe 
    df = df.drop(['Age_Label'], axis=1)
    top_5_brands = {'Chevrolet':'Chevrolet', 'Ford':'Ford', 'Toyota':'Toyota', 'Honda': 'Honda', 'Dodge': 'Dodge'}
    df['top_5_vehicles'] = df['Vehicle_Manufacturer'].apply(lambda Vehicle_Manufacturer: top_5_brands[Vehicle_Manufacturer] if (Vehicle_Manufacturer in top_5_brands) else 'Other')
    df['age_group'] = df['AGE'].apply(lambda age: get_age_segment(age))    
    cols_to_keep = ['Case_Number', 'State', 'City', 'Latitude', 'Longitude', 'Month', 'Route',  'Weather', 'top_5_vehicles', 'Vehicle_Model', 'AGE', 'age_group', 'Sex', 'DOA_Status']
    df_clean = df[cols_to_keep].dropna()

    # convert to json format
    return df_clean.to_json(orient='records')


if __name__ == "__main__":
    app.run(debug=True)
