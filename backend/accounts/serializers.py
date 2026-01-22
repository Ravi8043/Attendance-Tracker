from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    # these fields are write only and required for registration
    # password field already inside User model but we are writing it agian to make it write only
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        #these are the fields which api accepts
        fields = ('username', 'password', 'password2', 'id_card_number')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create(
            username=validated_data['username'],
            id_card_number=validated_data['id_card_number']
        )
        user.set_password(validated_data['password']) # set_password hashes the password
    # def create(self, validated_data):
    #     validated_data.pop('password2')
    #     return User.objects.create_user(**validated_data)
    # i can also use above line instead of set_password im doing it manually to make sure password is hashed for sure.

        user.save()
        return user
