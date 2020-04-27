import factory
from auth_app.models import User


class UserFactory(factory.django.DjangoModelFactory):
    email = factory.Sequence(lambda n: f'user{n}@testing.com')
    first_name = factory.Faker('first_name')
    first_name = factory.Faker('last_name')
    password = factory.PostGenerationMethodCall("set_password", "Boiii12345")

    class Meta:
        model = User
