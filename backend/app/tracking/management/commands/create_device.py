import djclick as click
from tracking.models import Device


@click.command()
@click.option('--name', prompt='Name of the device')
@click.option('--tracker_id', prompt='tracker id of the device')
def create_device(name, tracker_id):
    if not tracker_id or not name:
        return click.secho("Please provide a name and tracker id")

    device = Device(name=name, tracker_id=tracker_id)
    device.save()
    click.secho(f'Device {device.name} with tracker id: ' +
                click.style(device.tracker_id, bold=True, fg='green') +
                f' created successfully.\nNow you can add this device for a user with ' +
                f'given tracker id.')
