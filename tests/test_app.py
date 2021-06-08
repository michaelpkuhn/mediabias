import os
import tempfile
from flask.globals import request

import pytest

from app import app


@pytest.fixture
def client():
    db_fd, app.app.config['DATABASE'] = tempfile.mkstemp()
    app.app.config['TESTING'] = True

    with app.app.test_client() as client:
        # with app.app.app_context():
        #     result = app.db_query("fox")
        #     print(result)
        yield client

    os.close(db_fd)
    os.unlink(app.app.config['DATABASE'])


def query(client, q_str):
    return client.post('/database', data=dict(text=q_str))


def test_site(client):
    rv = client.get('/')
    assert rv.data != None
    assert rv.status_code == 200


def test_query(client):
    fp = './tests/resources/db_fox_query2.txt'
    with open(fp, 'r') as f:
        test_data = f.read()
    rv = query(client, 'fox')
    assert rv.data != None
    # with open('./tests/resources/db_fox_query2.txt', 'w+b') as f:
    #     f.write(rv.data)
    print(type(rv.data), type(test_data))
    # breakpoint()
    assert rv.data == bytes(test_data, encoding='utf-8')
