# make_mock_data.py

import random
import datetime
import json
import collections

# starting time, opening of the restaurant?
gotInLine = datetime.datetime(2016, 9, 19, 10, 00, 000)

# function to make time for got in line
def funcGotInLine(prevGotInLine):
	newMinutes = datetime.timedelta(minutes = random.randrange(2))
	newSeconds = datetime.timedelta(seconds = random.randrange(60))
	current = prevGotInLine + newMinutes + newSeconds
	return current

# function to make time for ordered food
def funcOrderedFood(gotInLine):
	newMinutes = datetime.timedelta(minutes = random.randrange(15))
	newSeconds = datetime.timedelta(seconds = random.randrange(60))
	current = gotInLine + newMinutes + newSeconds
	return current

# function to make time for got food
def funcGotFood(orderedFood):
	newMinutes = datetime.timedelta(minutes = random.randrange(10))
	newSeconds = datetime.timedelta(seconds = random.randrange(60))
	current = orderedFood + newMinutes + newSeconds
	return current



# actually gets the times and prints them out
count = 1
# data = {}
data = collections.defaultdict(dict)
eateries_list = ["Synapsis", "Trillium"]
# for x in range(1, len(eateries_list)):
for x in eateries_list:
	entries = []
	for i in range(100, 0, -1):
		gotInLine = funcGotInLine(gotInLine)
		orderedFood = funcOrderedFood(gotInLine)
		gotFood = funcGotFood(orderedFood)
		entries.append({"gotInLine":str(gotInLine), "orderedFood":str(orderedFood), "gotFood":str(gotFood)})
		# print(json.dumps({"gotInLine":str(gotInLine), "orderedFood":str(orderedFood), "gotFood":str(gotFood)}, indent = 4))
		i  -= 1
	# data[x] = entries
	data[count]['name'] = x
	data[count]['time'] = entries
	count += 1

print(json.dumps(data, indent = 4))