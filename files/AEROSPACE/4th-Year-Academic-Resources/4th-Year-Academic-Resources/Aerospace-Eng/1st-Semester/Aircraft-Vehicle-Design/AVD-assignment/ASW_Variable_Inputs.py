# algorithm
# assign constants
# take range values as inputs
# take payload values as inputs
# create function for range, endurance
# x represents range
# y represents payload
# z represents total weight

from math import exp
import matplotlib.pyplot as plt


# warmup and takeoff
w1_w0 = 0.97
#climb
w2_w1 = 0.985
#land
w7_w6 = 0.995
#loiter endurance
en_dure_1 = 10800 #s
en_dure_2 = 1200 #s

#specific fuel consumption
c_cruise = 0.0001389 #/s
c_loiter = 0.0001111 #/s

#velocity
vel_cruise = 569.9 #ft/s

#L/D ratios
L_D_cruise = 13.9
L_D_loiter = 16

#constants
A = 0.93
c = -0.07
k_vs = 1

# taking inputs for range and endurance
ra_nge = eval(input('Enter your range value: '))

if type(ra_nge) is int:
    ra_nge = [ra_nge]

#pay_load = eval(input('Enter your payload value: '))
pay_load = eval(input('Enter your payload values: '))

if type(pay_load) is int:
    pay_load = [pay_load]

#cruise fxn
def CRUISE(ra_nge, s_f_c, vel, L_D):
    w3_w2 = exp(-(ra_nge*s_f_c)/(vel*L_D))
    return w3_w2

#loiter fxn
def LOITER(en_dure, s_f_c, L_D):
    w4_w3 = exp(-(en_dure*s_f_c)/(L_D))
    return w4_w3
w4_w3 = LOITER(en_dure_1, c_loiter, L_D_loiter)

w6_w5 = LOITER(en_dure_2, c_loiter, L_D_loiter)

w_crew = 800 #lb

x = []
y = []
z = []

for r in ra_nge:
    w3_w2 = CRUISE(r, c_cruise, vel_cruise, L_D_cruise)
    #print(w3_w2)
    w5_w4 = w3_w2
    w7_w0 = w1_w0*w2_w1*w3_w2*w4_w3*w5_w4*w6_w5*w7_w6
    wf_w0 = 1.06*(1-w7_w0)
    for p in pay_load:
        w0_guess = 4*(w_crew + p)
        we_w0 = A*(w0_guess**c)*k_vs
        while True:
            w0 = (w_crew + p)/(1 - wf_w0 - we_w0)
            err = abs(w0 - w0_guess)
            #print(err)
            if err <= 10**-4:
                x.append(r) # storing range values
                y.append(p) # storing payload values
                z.append(w0) # storing w0 values
                break
            else:
                w0_guess = (w0_guess + w0)/2
            
print(x,y,z, sep = '\n') # this will print x,y and z separated by an enter key

#plotting graphs
# fig, ax = plt.subplots()
# ax.plot(x, y)
# plt.show()

# This is a version from my code to finalize your work.
if len(x) + len(y) == 2:
    print(z)
    # print out the take-off weight if a single input was made for the range and payload.

elif x[0] == x[-1]:
    # Display a graph of payload vs take-off weight since the range is constant.
    plt.plot(y, z)
    plt.title(f"PAYLOAD VS TAKE-OFF WEIGHT \n CRUISE RANGE: {x[0]}-ft") # we plot y and z
    plt.xlabel("PAYLOAD -lb")
    plt.ylabel("TAKE-OFF WEIGHT -lb")

elif y[0] == y[-1]:
    # Display a graph of range vs take-off weight since the payload is constant.
    plt.plot(x, z)
    plt.title(f"RANGE VS TAKE-OFF WEIGHT AT A PAYLOAD OF {y[0]}-lb")
    plt.xlabel("RANGE -ft")
    plt.ylabel("TAKE-OFF WEIGHT -lb")

plt.show()

# You did great bro! Nine days wonder.