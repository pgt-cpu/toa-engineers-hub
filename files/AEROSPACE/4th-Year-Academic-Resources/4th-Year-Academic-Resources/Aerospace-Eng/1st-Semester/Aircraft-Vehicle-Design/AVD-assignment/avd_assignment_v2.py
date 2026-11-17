# importing needed functions
from math import exp
import os
from matplotlib import pyplot as plt

# Setting up the file for data storage
try:
    os.remove("data_range.txt")
    os.remove("data_payload.txt")
    os.remove("data_weight.txt")
except:
    pass

# Taking in general inputs for future calculations
R = eval( input("Enter your cruise range (start, end, step): ") )  # ---- range of values
W_payload = eval( input("Enter your payload (start, end, step): ") )  # ---

# adjusting for single input
if type(R) in [int, float]: R = [R]
if type(W_payload) in [int, float]: W_payload = [W_payload]

# Setting project constants and constraints.
C_cruise = 0.0001389; V = 569; L_D_cruise = 13.9; L_D_loiter = 16; E_l1 = 10800; C_loiter = 0.0001111; E_l2 = 1200; W_crew = 800
W1_W0 = 0.97; W2_W1 = 0.985; W7_W6 = 0.995

# Creating cruise function
def cruise_func(R, C, L_D_cruise, V):
    return exp( -(R*C) / (L_D_cruise*V) )

# Creating loiter function
def loiter_func(E, C, L_D_loiter):
    return exp( -(E*C) / L_D_loiter)

# looping the range value
for r in R:  # R = range(1000, 2000, 100)
    W7_W0 = W1_W0 * W2_W1 * cruise_func(r, C_cruise, L_D_cruise, V) * loiter_func(E_l1, C_loiter, L_D_loiter) * cruise_func(r, C_cruise, L_D_cruise, V) * loiter_func(E_l2, C_loiter, L_D_loiter) * W7_W6

    for payload in W_payload:
        # Guessing the initial weight
        W0_guess = 50000 # 4 * (payload + W_crew)

        while True:
            # Calculating estimated weight, W0
            W0 = (W_crew + payload) / (1 - 1.06*(1 - W7_W0) - 0.93*W0_guess**-0.07 )

            # print(W0, W0_guess, sep="\t")
            # Updating error, err
            err = abs(W0 - W0_guess)

            if err <= 10**-4:   # 0.0001
                # saving data in a text file. Data: r, payload, W0
                with open("data_range.txt", "+a") as fh_range:
                    fh_range.write(str(r)+"\n")
                
                with open("data_payload.txt", "+a") as fh_payload:
                    fh_payload.write(str(payload)+"\n")
                
                with open("data_weight.txt", "+a") as fh_w0:
                    fh_w0.write( str(W0)+"\n" )
                
                break
            else:
                W0_guess = (W0 + W0_guess)/2
        

# plotting the graph
# Retrive the data into x, y and z.
with open("data_range.txt", "r") as fh_range:
    x = list(map(float, fh_range.readlines()))

with open("data_payload.txt", "r") as fh_payload:
    y = list(map(float, fh_payload.readlines()))

with open("data_weight.txt", "r") as fh_w0:
    z = list(map(float, fh_w0.readlines()))

# fig = plt.figure()
# ax = plt.axes(projection = "3d")
# ax.plot3D(x, y, z, "black")

# Making decision on what to plot
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
    plt.title(f"RANGE VS TAKE-OFF WEIGHT \n PAYLOAD OF {y[0]}-lb")
    plt.xlabel("RANGE -ft")
    plt.ylabel("TAKE-OFF WEIGHT -lb")

plt.show()


# fig = plt.figure()
# ax = plt.axes(projection = "3d")
# ax.plot3D([2, 4], [10, 50], [15, -100], "blue")
# ax.set_title("Trials")



