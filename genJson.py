from random import randrange as rnd
import json

entries = 100
time = 0
numChkn = 4
chkData = {}
fileName  = "ex1.json"

def convHhmmss(sec):
    s = sec % 60
    m = int(sec/60) % 60
    h = int(sec/pow(60,2)) % 60
    timeStr = str(h) + ":" + str(m).zfill(2) + ":" + str(s).zfill(2)
    return timeStr

def makeEvent(numChkn):
    chkn1 = rnd(numChkn)+1
    chkn2 = chkn1
    while chkn2 == chkn1:
        chkn2 = rnd(numChkn)+1
    return str(chkn1) + " T " + str(chkn2)


for entry in range(entries):
    time += rnd(100)
    hms = convHhmmss(time)
    timeStr = str(time) + "^" + hms
    chkData[timeStr] = makeEvent(numChkn)

with open(fileName, 'w') as outFile:
    json.dump(chkData, outFile)


