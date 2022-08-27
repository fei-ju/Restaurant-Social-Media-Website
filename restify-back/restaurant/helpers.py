from restaurant.models import Notification

def update_notifications(notification_type, to, content):
    '''
    Updates the notification table

    notification_type is an integer that corresponds to one of the following values:
    0 : Like Restaurant
    1 : Unlike Restaurant
    2 : Follow
    3 : Unfollow
    4 : Create Post
    5 : Delete Post
    6 : Comment
    7 : Delete Comment
    8: Like Post
    9: Unlike Post
    10: New Menu
    11: Edit Menu
    12: Delete Menu
    '''

    params = {
        'type' : notification_type,
        'content' : content,
        'notification_to' : to,
    }

    notification = Notification(**params)
    notification.save()

def notify_users(users, notification_type, content):
    '''
    Creates a new notification for the following users by updating the notification table
    '''

    print(users)

    for user in users:
        update_notifications(notification_type, user, content)
