from datetime import datetime
from Crypto.Cipher import AES
import config
import time
import os
import base64
import random


def now():
    return time.strftime("%Y-%m-%d %H:%M:%S")

def year():
    return datetime.now().strftime("%Y")
    
def randomString(_len):
    # encrt_str = trim("%s%s"%(now(),seed))[:16]
    # return md5.new(encrypt_decrypt("e",encrt_str)).hexdigest()[16:32] #TODO : make real random string
    id_ = "";
    cypher_ = [];
    cypher = "0123456789?@#$!%&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for i in range(len(cypher)):
        cypher_.append(cypher[i])

    for i in range(_len):
        id_ += cypher_[ int(round(random.randint(0,len(cypher)-1 ))) ]

    return id_

def parseStrDate(str_):
    to_d = datetime.strptime(str_,"%Y-%m-%d %H:%M:%S")
    return to_d.strftime("%a %b, %d %I:%M %p")

def datetimeToDate(dt):
    day = dt.strftime('%Y-%m-%d')
    
    return day

def datetimeToTime(dt):
    return dt.strftime('%H:%M:%S')


def today():
    return time.strftime("%Y-%m-%d")


def to_str(arr_v_str):
    """ Convert dict values to string literals """
        # print(arr_v_str)
    for k,v in arr_v_str.items():
        arr_v_str[k] = str(v)
        # print(arr_v_str[k])

    return arr_v_str


def trim(str_):
    return str_.replace(" ","")

# make dictionary key,value referenceable by dot '.' notation
class Map(dict):
     # Usage: arr = Map(dict)
     # keyvalue = arr.key
    def __init__(self, *args, **kwargs):
        super(Map, self).__init__(*args, **kwargs)
        for arg in args:
            if isinstance(arg, dict):
                for k, v in arg.items():
                    self[k] = v

        if kwargs:
            for k, v in kwargs.items():
                self[k] = v

    def __getattr__(self, attr):
        return self.get(attr)

    def __setattr__(self, key, value):
        self.__setitem__(key, value)

    def __setitem__(self, key, value):
        super(Map, self).__setitem__(key, value)
        self.__dict__.update({key: value})

    def __delattr__(self, item):
        self.__delitem__(item)

    def __delitem__(self, key):
        super(Map, self).__delitem__(key)
        del self.__dict__[key]



