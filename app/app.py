from flask import Flask, jsonify, render_template, redirect, make_response, json, request
import os
from joblib import load
import subprocess
# Tools to remove stopwords from tweets
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')
from nltk.tokenize import word_tokenize
nltk.download('punkt')

from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer

#DB Imports
import sqlalchemy.dialects.postgresql
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import create_engine, inspect


stop_words = set(stopwords.words('english'))

loading_error = False
num_loaded = 0
temp_path = ''
try:
    # Works on heroku
    bigram_vectorizer = load('app/static/js/data/data_preprocessors/bigram_vectorizer.joblib')
    bigram_tf_idf_transformer = load('app/static/js/data/data_preprocessors/bigram_tf_idf_transformer.joblib')
    sgd_classifier = load('app/static/js/data/classifiers/sgd_classifier.joblib')
except:
    # Works locally
    loading_error=True
    bigram_vectorizer = load('./static/js/data/data_preprocessors/bigram_vectorizer.joblib')
    bigram_tf_idf_transformer = load('./static/js/data/data_preprocessors/bigram_tf_idf_transformer.joblib')
    sgd_classifier = load('./static/js/data/classifiers/sgd_classifier.joblib')


app = Flask(__name__)
app.config['DEBUG']= True

#DATABASE SET UP
uri = 'postgres://vigleotgdkofne:42870962558c95a8818d4a758b4e989db94e92654344ab44d26537f528a8bc81@ec2-34-195-169-25.compute-1.amazonaws.com:5432/d3cp995qbfoemo'
app.config['SQLALCHEMY_DATABASE_URI'] = uri
db = SQLAlchemy(app)
engine = db.engine


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ranking')
def ranking():
    return render_template('ranking.html')

@app.route('/classification')
def classify():
    return render_template('classification.html')

@app.route('/methodology')
def method():
    return render_template('Methodology.html')

@app.route('/mlmodels')
def my_form():
    return render_template('mlmodels.html',party_prediction = '')

@app.route('/mlmodels', methods=['POST'])
def mlmodels():
    in_text = request.form['text']
    # if loading_error:
    #     def list_tostring(input_list):
    #         return '   '.join(input_list)
    #     party_result = os.getcwd()+' loaded '+str(num_loaded)+'  '+list_tostring(os.listdir())
    # else:
    def list_tostring(input_list):
        return ' '.join(input_list)
    def remove_stopwords(input_list):
        return [w for w in input_list if not w in stop_words]
    fun_input = list_tostring(remove_stopwords(word_tokenize(in_text)))

    X_pred = bigram_vectorizer.transform([fun_input])
    X_pred = bigram_tf_idf_transformer.transform(X_pred)
    result = sgd_classifier.predict(X_pred)
    if result[0] == 'R':
        party_result = 'Predicted Republican Tweet'
    else:
        party_result = 'Predicted Democrat Tweet  '
    return render_template('mlmodels.html', party_prediction = party_result)

@app.route('/database')
def db_form():
    return render_template('database.html')


@app.route('/database', methods=['POST'])
def db_query():
    in_text = request.form['text'].lower()
    search_text = ''.join(in_text.split())
    #query = F"Select * from final_db where domain_name Like lower('%%{in_text}%%')"
    query = F"Select * from final_db where domain_name Like '%%{search_text}%%'"

    result = ''

    result = engine.execute(query).fetchall()

    return render_template('database.html', media_org=result)


@app.route('/sitemap')
def sitemap():
    home_page = '/'
    classify_page = '/classification'
    ranking_page = '/ranking'
    method_page = '/methodology'
    mlmodels_page = '/mlmodels'
    database_page = '/database'
    return(
        f"Available Routes:<br/>"
        f"<a href={home_page}>Home</a><br/>"
        f"<a href={classify_page}>{classify_page}</a><br/>"
        f"<a href={ranking_page}>{ranking_page}</a><br/>"
        f"<a href={method_page}>{method_page}</a><br/>"
        f"<a href={mlmodels_page}>{mlmodels_page}</a><br/>"
        f"<a href={database_page}>{database_page}</a><br/>"
        )


if __name__ == '__main__':

    app.run(debug=True)