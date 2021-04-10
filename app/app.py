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
from sqlalchemy import create_engine, func, inspect

# from .ccdf_data import x_data
# from .ccdf_data import y_data

stop_words = set(stopwords.words('english'))

loading_error = False
num_loaded = 0
temp_path = ''
try:
    # Works on heroku
    from .ccdf_data import x_data
    from .ccdf_data import y_data
    bigram_vectorizer = load('app/static/js/data/data_preprocessors/bigram_vectorizer.joblib')
    bigram_tf_idf_transformer = load('app/static/js/data/data_preprocessors/bigram_tf_idf_transformer.joblib')
    sgd_classifier = load('app/static/js/data/classifiers/sgd_classifier.joblib')
except:
    # Works locally
    from ccdf_data import x_data
    from ccdf_data import y_data
    #loading_error=True
    bigram_vectorizer = load('./app/static/js/data/data_preprocessors/bigram_vectorizer.joblib')
    bigram_tf_idf_transformer = load('./app/static/js/data/data_preprocessors/bigram_tf_idf_transformer.joblib')
    sgd_classifier = load('./app/static/js/data/classifiers/sgd_classifier.joblib')


app = Flask(__name__)
app.config['DEBUG']= True
#Disable deprecation warning and overhead
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#DATABASE SET UP
uri = 'postgresql://vigleotgdkofne:42870962558c95a8818d4a758b4e989db94e92654344ab44d26537f528a8bc81@ec2-34-195-169-25.compute-1.amazonaws.com:5432/d3cp995qbfoemo'
app.config['SQLALCHEMY_DATABASE_URI'] = uri
db = SQLAlchemy(app)
engine = db.engine


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/classification')
def classify():
    return render_template('classification.html')

@app.route('/methodology')
def method():
    return render_template('Methodology.html')

@app.route('/mlmodels')
def my_form():
    return render_template('mlmodels.html',party_prediction = '', in_text='')

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
    def get_accuracy(input_dec,cdf_x,cdf_y):
        y_len_minus_two = len(cdf_y)-2
        abs_input_dec = abs(input_dec)
        if abs_input_dec <= cdf_x[0]:
            return 'highly unreliable'
        elif abs_input_dec >= cdf_x[len(x_data)-1]:
            return 'highly reliable'
        else:
            j = 0
            while (abs_input_dec>=cdf_x[j])&(j<y_len_minus_two):
                j=j+1
            return 'estimated probability of error: {0:.2f}%.'.format(cdf_y[j]*100)

    X_pred = bigram_vectorizer.transform([fun_input])
    X_pred = bigram_tf_idf_transformer.transform(X_pred)
    result = sgd_classifier.predict(X_pred)
    dec = sgd_classifier.decision_function(X_pred)
    if result[0] == 'R':
        party_result = 'Predicted Republican Tweet - '
    else:
        party_result = 'Predicted Democrat Tweet - '
    in_text = 'Querried tweet:  '+in_text
    party_result = party_result + get_accuracy(dec,x_data,y_data)
    return render_template('mlmodels.html', in_text = in_text, party_prediction = party_result)

@app.route('/database')
def db_form():
    return render_template('database.html')


@app.route('/database', methods=['POST'])
def db_query(q_str = None):
    # query_string = q_str if q_str else request.form['text']
    query_string = request.form['text']
    in_text = query_string.lower()
    search_text = ''.join(in_text.split())
    query = F"Select * from final_db where domain_name Like '%%{search_text}%%'"

    result = ''
    query_string_out = ''
    result = engine.execute(query).fetchall()
    num_results = len(result)
    query_string_out = 'You queried: \"'+query_string+'\"'

    return render_template('database.html', media_org=result, query_string_out = query_string_out)


@app.route('/sitemap')
def sitemap():
    home_page = '/'
    about_page = '/about'
    classification = '/classification'
    method_page = '/methodology'
    mlmodels_page = '/mlmodels'
    database_page = '/database'
    return(
        f"Available Routes:<br/>"
        f"<a href={home_page}>Home</a><br/>"
        f"<a href={about_page}>{about_page}</a><br/>"
        f"<a href={classification}>{classification}</a><br/>"
        f"<a href={method_page}>{method_page}</a><br/>"
        f"<a href={mlmodels_page}>{mlmodels_page}</a><br/>"
        f"<a href={database_page}>{database_page}</a><br/>"
        )


if __name__ == '__main__':

    app.run(debug=True)
