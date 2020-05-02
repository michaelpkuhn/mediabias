from flask import Flask, jsonify, render_template, redirect, make_response, json


app = Flask(__name__)
app.config['DEBUG']= True


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/classification')
def classify():
    return render_template('classification.html')

@app.route('/sitemap')
def sitemap():
    home_page = '/'
    classify_page = '/classification'
    return(
        f"Available Routes:<br/>"
        f"<a href={home_page}>Home</a><br/>"
        f"<a href={classify_page}>{classify_page}</a><br/>"
        )


if __name__ == '__main__':

    app.run(debug=True)