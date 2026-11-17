clear all
clc
n = input('input year >> ');
y= n;
datenum([y+1,1,1])- datenum([y,1,1])
sum(eomday(y, [1:12]))

