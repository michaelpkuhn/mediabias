from flask import Flask, jsonify, render_template, redirect, make_response, json, request
import os
from joblib import load

# Tools to remove stopwords from tweets
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')
from nltk.tokenize import word_tokenize
nltk.download('punkt')

from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer

stop_words = set(stopwords.words('english'))

temp_path = os.path.abspath('data_preprocessors/bigram_tf_idf_transformer.joblib')
bigram_vectorizer = load(temp_path)
temp_path = os.path.abspath('data_preprocessors/bigram_tf_idf_transformer.joblib')
bigram_tf_idf_transformer = load(temp_path)
temp_path = os.path.abspath('classifiers/sgd_classifier.joblib')
sgd_classifier = load(temp_path)

app = Flask(__name__)
app.config['DEBUG']= True


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
    def list_tostring(input_list):
        return ' '.join(input_list)
    def remove_stopwords(input_list):
        return [w for w in input_list if not w in stop_words]
    fun_input = list_tostring(remove_stopwords(word_tokenize(in_text)))

    #X_pred = bigram_vectorizer.transform([fun_input])
    #X_pred = bigram_tf_idf_transformer.transform(X_pred)
    #result = sgd_classifier.predict(X_pred)
    result = 'pizza'
    if result[0] == 'R':
        party_result = 'Predicted Republican Tweet'
    else:
        party_result = 'Predicted Democrat Tweet'
        party_result = 'Repeated text: '+in_text+' loads all'
    return render_template('mlmodels.html', party_prediction = party_result)

@app.route('/sitemap')
def sitemap():
    home_page = '/'
    classify_page = '/classification'
    ranking_page = '/ranking'
    method_page = '/methodology'
    mlmodels_page = '/mlmodels'
    return(
        f"Available Routes:<br/>"
        f"<a href={home_page}>Home</a><br/>"
        f"<a href={classify_page}>{classify_page}</a><br/>"
        f"<a href={ranking_page}>{ranking_page}</a><br/>"
        f"<a href={method_page}>{method_page}</a><br/>"
        f"<a href={mlmodels_page}>{mlmodels_page}</a><br/>"
        )


if __name__ == '__main__':

    app.run(debug=True)