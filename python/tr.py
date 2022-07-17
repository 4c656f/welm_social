def kwargs(*args, **kwargs):
    for i in args:
        print(i)
    print(kwargs)

kwargs("Jonathan","Jonathan", dog="Brock", fish=["Larry", "Curly", "Moe"], turtle="Shelldon")