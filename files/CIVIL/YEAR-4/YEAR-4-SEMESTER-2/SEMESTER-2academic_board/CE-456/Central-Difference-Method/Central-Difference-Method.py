# -*- coding: utf-8 -*-
"""
Created on Fri Jun 11 16:36:34 2021

@author: Amdzake Robert
"""
#                       CENTRAL DIFFERENCE METHOD
## CONSTANTS
'''
length = int(input('Input the value of the length: '))
mass = int(input('Input the value of the mass: '))
Damping = int(input('Input the value of the Damping: '))
print('\n## Perform the calculation for the value of the Stiffness before inserting into the program ##')
Stiffness = int(input('Input the value of the stiffness: '))
'''
## EXCITATION PROFILE
c = int(input('Input the value of the y intercept: ')) 
x_intercept = float(input('Input the value of the x intercept: '))
if x_intercept == 0:
    m = 0    
else:
    m = (c-0)/(0-(x_intercept))
#       LOAD FUNCTION; Equation of a Line Rt = mx + c
if x_intercept == 0 and m == 0:
    print(f'SCENARIO 2')
    print(f'Rt = {c}')
else:
    print(f'SCENARIO 1')
    print(f'Rt = {m}x + {c}')
def SCE_1(m, i, c):
    Rt = (m*i)+c
    return Rt
'''
load = []
Time_values = []
print('\n## Input load and Time_values as whole numbers ##')
time_step = int(input('Input the value of the time steps: '))
Time = int(input('Input the duration of excitation: '))    
for i in range(0, Time+1, 1):
    Rt = SCE_1(m, (i/10), c)
    if Rt < 0:
        Rt = 0
    d = (i/10)
    #print(Rt)
    load.append(Rt)
    Time_values.append(d)
print(Time_values)
print(load)
'''