import djclick as click
from auth_app.models import User


@click.command()
@click.option('--first_name', prompt='First name')
@click.option('--last_name', prompt='Last name')
@click.option('--email', prompt='Email (username)')
@click.option('--password', prompt="Password", hide_input=True)
@click.option('--password_repeat', prompt="Repeat password", hide_input=True)
def create_user(first_name, last_name, email, password, password_repeat):
    if password != password_repeat:
        return click.secho("Passwords does not match")

    user = User.objects.create_user(
        email=email, password=password, first_name=first_name, last_name=last_name
    )
    user.save()
    click.secho(f'User {user.name} ({user.email}) created successfully')
