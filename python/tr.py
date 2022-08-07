array1 = ["val1","val2","val3","val4"]
array2 = ["val2","val1","val4","val3",]


def sort(arr1, arr2):
    def sort_fc(e):
        return e["weight"]
    return_list = []
    return_list_with_weights = []
    arr1.dict().
    dict_of_weights ={

    }


    for id, value in enumerate(arr1):
        dict_of_weights[value] = id
        return_list.append(value)


    for id, value in enumerate(arr2):
        prev_weight = dict_of_weights[value]
        dict_of_weights[value] = prev_weight + id


    for i in dict_of_weights:
        return_list_with_weights.append({"val":i, "weight":dict_of_weights[i]})

    print(return_list_with_weights)

    return_list_with_weights.sort(reverse = True, key= sort_fc)

    print(return_list_with_weights)

    return

sort(array1, array2)