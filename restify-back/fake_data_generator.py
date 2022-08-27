import requests
from faker import Faker
from requests_toolbelt.multipart.encoder import MultipartEncoder
import random
import os
base_url = "http://127.0.0.1:8000"

fake = Faker()

def signup():
    '''
    curl -X POST "http://127.0.0.1:8000/user/register/" -H  "accept: application/json" -H  "Content-Type: multipart/form-data" -H  "X-CSRFToken: 9xswGjO8t6X2BvOcFRJkwGnh0Zul5vlalmxdBA63UqKRfIjaflEaofWaRY0L3B2T" -F "first_name=test" -F "last_name=aaa" -F "email=a@a.com" -F "password=123456" -F "phone_number=5191111111"
    '''
    url = base_url+'/user/register/'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data',
    
    }
    email = fake.email()
    password = fake.password()
    avatar_folder = "/Users/feiju/Downloads/avatars/"
    # get all the files name inside the folder
    files = [avatar_folder+f for f in os.listdir(avatar_folder) if os.path.isfile(os.path.join(avatar_folder, f))]

    data = {
        'first_name': fake.first_name(),
        'last_name': fake.last_name(),
        'email': email,
        'password': password,
        'phone_number': str(random.randint(1000000000, 9999999999)),
        'avatar': ("avatar.png",open(random.choice(files),"rb"),"image/png"),
    }
    mp_encoder = MultipartEncoder(
        fields=data,
    )
    headers['Content-Type'] = mp_encoder.content_type
    response = requests.post(url, headers=headers, data=mp_encoder)
    print(response.json())
    with open("accounts.txt", "a") as f:
        f.write( email + " " + password + "\n")
    return [email, password]
def login(email,password):
    '''
    curl -X POST "http://127.0.0.1:8000/user/login/" -H  "accept: application/json" -H  "Content-Type: application/json" -H  "X-CSRFToken: 9xswGjO8t6X2BvOcFRJkwGnh0Zul5vlalmxdBA63UqKRfIjaflEaofWaRY0L3B2T" -d "{  \"email\": \"lynchthomas@example.com\",  \"password\": \"tx)DG_Ih+7\"}"
    '''
    url = base_url+'/user/login/'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json',

    }
    data = {
        'email': email,
        'password': password,
    }
    response = requests.post(url, headers=headers, json=data)
    print(response.json())
    return response.json()['access']

def create_restaurant(token):
    '''
    curl -X POST "http://127.0.0.1:8000/restaurant_general/information/" -H  "accept: application/json" -H  "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjUwMDY3ODM1LCJpYXQiOjE2NDk5ODE0MzUsImp0aSI6IjYwNGMzMWMxZTIyNzRkMDhiOTEwZWU2Y2IwZDliNTVkIiwidXNlcl9pZCI6M30.zl1dNX6A4Mf6P_tQ6s3uYK4S2OPoBTotKdlU7ESskck" -H  "Content-Type: multipart/form-data" -H  "X-CSRFToken: 9xswGjO8t6X2BvOcFRJkwGnh0Zul5vlalmxdBA63UqKRfIjaflEaofWaRY0L3B2T" -F "name=name" -F "address=address" -F "postal_code=L2S" -F "phone=1111111111"
    '''
    url = base_url+'/restaurant_general/information/'
    headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
    }
    logos = "/Users/feiju/Downloads/restaurant_logos/"
    # get all the files name inside the folder
    files = [logos+f for f in os.listdir(logos) if os.path.isfile(os.path.join(logos, f))]
    # print(files)
    # return
    data = {
        'name': fake.company(),
        'address': fake.address(),
        'postal_code': fake.postcode(),
        'phone': str(random.randint(1000000000, 9999999999)),
        'logo': ("logo.png",open(random.choice(files),"rb"),"image/png"),
    }
    mp_encoder = MultipartEncoder(
        fields=data,
    )
    headers['Content-Type'] = mp_encoder.content_type
    response = requests.post(url, headers=headers, data=mp_encoder)
    print(response.json())
    return response.json()['id']


def add_post(token):
    '''
    curl -X POST "http://35.183.127.226:8000/post_actions/post/" -H  "accept: application/json" -H  "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjUwMjU5OTc3LCJpYXQiOjE2NTAxNzM1NzcsImp0aSI6ImIzOWY0YTYwMWM3NDQwYTg4Zjk3ZTQxOGQ1MDBlODdkIiwidXNlcl9pZCI6MjI0fQ.m0i-1g7Jri00qqRkf9JsCEdsid8CilGdVAlOK17j9gY" -H  "Content-Type: application/json" -H  "X-CSRFToken: yjNMvVbDUf2Lq99wigW2WzcRnkfzR01iiYWiReQ664N8o22YjK9vbRg6XgmKt73W" -d "{  \"post_content\": \"string\",  \"post_title\": \"string\",  \"show_to_public\": true}"
    '''
    url = base_url+'/post_actions/post/'
    headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }
    data = {
        'post_content': fake.text(),
        'post_title': fake.text()[:30],
        'show_to_public': True,
    }
    response = requests.post(url, headers=headers, json=data)
    print(response.json())

def add_menu(token):
    '''
    curl -X POST "http://35.183.127.226:8000/restaurant_menu/" -H  "accept: application/json" -H  "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjUwMjU5OTc3LCJpYXQiOjE2NTAxNzM1NzcsImp0aSI6ImIzOWY0YTYwMWM3NDQwYTg4Zjk3ZTQxOGQ1MDBlODdkIiwidXNlcl9pZCI6MjI0fQ.m0i-1g7Jri00qqRkf9JsCEdsid8CilGdVAlOK17j9gY" -H  "Content-Type: application/json" -H  "X-CSRFToken: yjNMvVbDUf2Lq99wigW2WzcRnkfzR01iiYWiReQ664N8o22YjK9vbRg6XgmKt73W" -d "{  \"name\": \"string\",  \"price\": 1,  \"description\": \"string\",  \"show_to_public\": true}"
    '''
    url = base_url+'/restaurant_menu/'
    headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }
    data = {
        'name': fake.text()[:10],
        'price': round(random.randint(100, 10000)/100,2),
        'description': fake.text()[:30],
        'show_to_public': True,
    }
    response = requests.post(url, headers=headers, json=data)
    print(response.json())

def add_comments(token,restaurant_id):
    '''
    curl -X POST "http://35.183.127.226:8000/post_comments/comments/" -H  "accept: application/json" -H  "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjUwMjU5OTc3LCJpYXQiOjE2NTAxNzM1NzcsImp0aSI6ImIzOWY0YTYwMWM3NDQwYTg4Zjk3ZTQxOGQ1MDBlODdkIiwidXNlcl9pZCI6MjI0fQ.m0i-1g7Jri00qqRkf9JsCEdsid8CilGdVAlOK17j9gY" -H  "Content-Type: application/json" -H  "X-CSRFToken: yjNMvVbDUf2Lq99wigW2WzcRnkfzR01iiYWiReQ664N8o22YjK9vbRg6XgmKt73W" -d "{  \"content\": \"string\",  \"comment_restaurant_to_id\": 14}"
    '''
    url = base_url+'/post_comments/comments/'
    headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }
    data = {
        'content': fake.text()[:100],
        'comment_restaurant_to_id': restaurant_id,
    }
    response = requests.post(url, headers=headers, json=data)
    print(response.json())


if __name__ == '__main__':

    # create_restaurant("1")
    # quit()
    for i in range(100):
        result = signup()
        print (result)
        token = login(result[0], result[1])
        x = create_restaurant(token)
        for j in range(random.randint(1,5)):
            add_menu(token)
        for j in range(random.randint(1,5)):
            add_post(token)
        for j in range(random.randint(1,5)):
            add_comments(token,x)

