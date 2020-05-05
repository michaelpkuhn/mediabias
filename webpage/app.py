from flask import Flask, jsonify, render_template, redirect, make_response, json, request

# Tools to remove stopwords from tweets
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')
from nltk.tokenize import word_tokenize
nltk.download('punkt')

from sklearn.linear_model import SGDClassifier
#from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer

stop_words = set(stopwords.words('english'))

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
def home():
    return render_template('mlmodels.html')

@app.route('/sitemap')
def sitemap():
    home_page = '/'
    classify_page = '/classification'
    ranking_page = '/ranking'
    method_page = '/methodology'
    return(
        f"Available Routes:<br/>"
        f"<a href={home_page}>Home</a><br/>"
        f"<a href={classify_page}>{classify_page}</a><br/>"
        f"<a href={ranking_page}>{ranking_page}</a><br/>"
        f"<a href={method_page}>{method_page}</a><br/>"
        )


if __name__ == '__main__':

    app.run(debug=True)