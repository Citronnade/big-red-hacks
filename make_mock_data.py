# make_mock_data.py

# http://stackoverflow.com/questions/651794/whats-the-best-way-to-initialize-a-dict-of-dicts-in-python

import random
import datetime
import time
import json
import collections

# starting time, opening of the restaurant?
gotInLine = datetime.datetime(2016, 9, 18, 10, 00, 000)

# function to make time for got in line
def funcGotInLine(date):
	year = gotInLine.year
	month = gotInLine.month
	date = date
	hour = random.randint(10, 13)
	minute = random.randint(0, 59)
	second = random.randint(0, 59)
	current = datetime.datetime(year, month, day, hour, minute, second)
	return current

# function to make time for ordered food
def funcOrderedFood(gotInLine):
	if gotInLine.minute > 45:
		newMinutes = datetime.timedelta(minutes = random.randrange(7,17))
	else:
		newMinutes = datetime.timedelta(minutes = random.randrange(1, 10))
	newSeconds = datetime.timedelta(seconds = random.randrange(60))
	current = gotInLine + newMinutes + newSeconds
	return current

# function to make time for got food
def funcGotFood(gotInLine, orderedFood):
	if gotInLine.minute > 45:
		newMinutes = datetime.timedelta(minutes = random.randrange(3, 8))
	else:
		newMinutes = datetime.timedelta(minutes = random.randrange(1, 5))
	if gotInLine.weekday() == 4: # 0 is Monday, 6 is Sunday, so 4 is Friday. More people eat off campus on a Friday?
		newMinutes = newMinutes - datetime.timedelta(minutes = random.randrange(2))
	newSeconds = datetime.timedelta(seconds = random.randrange(60))
	current = orderedFood + newMinutes + newSeconds
	return current

# function to get which weekday it is
def funcDayOfWeek(gotInLine):
	if gotInLine.weekday() == 0:
		return("Monday")
	elif gotInLine.weekday() == 1:
		return("Tuesday")
	elif gotInLine.weekday() == 2:
		return("Wednesday")
	elif gotInLine.weekday() == 3:
		return("Thursday")
	elif gotInLine.weekday() == 4:
		return("Friday")


# actually gets the times and prints them out
count = 1
# data = {}
data = collections.defaultdict(dict)
eateries_list = ["Synapsis", "Trillium"]
for d in range(1, 6):
	day = gotInLine.day + 1
	for x in eateries_list:
		entries = []
		visitors = random.randint(500, 1000)
		for i in range(visitors, 0, -1):
			gotInLine = funcGotInLine(day)
			orderedFood = funcOrderedFood(gotInLine)
			gotFood = funcGotFood(gotInLine, orderedFood)
			dayOfWeek = funcDayOfWeek(gotInLine)
			entries.append({"gotInLine":str(gotInLine), "orderedFood":str(orderedFood), "gotFood":str(gotFood), "dayOfWeek":dayOfWeek})
			# print(json.dumps({"gotInLine":str(gotInLine), "orderedFood":str(orderedFood), "gotFood":str(gotFood)}, indent = 4))
			i  -= 1
		# data[x] = entries
		data[count]['name'] = x
		data[count]['time'] = entries
		count += 1

print(json.dumps(data, indent = 4))