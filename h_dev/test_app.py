from flask import Flask, request, render_template
from joblib import load
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

@app.route('/')
def my_form():
    return render_template('index.html',party_prediction = '')

@app.route('/', methods=['POST'])
def my_form_post():
    def list_tostring(input_list):
        return ' '.join(input_list)
    def remove_stopwords(input_list):
        return [w for w in input_list if not w in stop_words]
    in_text = request.form['text']
    fun_input = list_tostring(remove_stopwords(word_tokenize(in_text)))
    bigram_vectorizer = load('data_preprocessors/bigram_vectorizer.joblib')
    bigram_tf_idf_transformer = load('data_preprocessors/bigram_tf_idf_transformer.joblib')
    X_pred = bigram_vectorizer.transform([fun_input])
    X_pred = bigram_tf_idf_transformer.transform(X_pred)
    sgd_classifier = load('classifiers/sgd_classifier.joblib')
    result = sgd_classifier.predict(X_pred)
    if result[0] == 'R':
        party_result = 'Predicted Republican Tweet'
    else:
        party_result = 'Predicted Democrat Tweet'
    return render_template('index.html', party_prediction = party_result)

app.debug = True
app.run()