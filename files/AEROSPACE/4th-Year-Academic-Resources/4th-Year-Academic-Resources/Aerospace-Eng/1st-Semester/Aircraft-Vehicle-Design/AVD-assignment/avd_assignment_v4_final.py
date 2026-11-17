# # GROUP ASSIGNMENT 1
# ## COURSE: AERO 473 AIRCRAFT VEHICLE DESIGN
# ## GROUP 7
# --------------------
# * Kobina Amo Adu
# * Frimpong Isaac
# * Thompson Daniel
# * Ferdinand Ferguson Alexander Hope
# * Mensah Dumfeh Rudolf
# * Dumasi Joshua Tawiah Iddi
# * Techie Derrick Joseph
# * Quayson Christian Nkrumah
# * Quansah Emmanuel
# * Jones Ato


from math import exp              # exponenet function, e
import matplotlib.pyplot as plt   # plotting library

# ## Defining relevant constants
global C_cruise, C_loiter, V, L_D_cruise, L_D_loiter, W_crew, fuel_allowance
C_cruise = 0.0001389   # specific fuel consumption at cruise, 1/s
V = 569                # Aircraft velocity at cruise, ft/s
L_D_cruise = 13.9      # Life-to-drag ratio during cruise
L_D_loiter = 16        # lift-to-drag ratio during loiter
E_l1 = 10800           # Endurance time for loiter 3 - 4, s
C_loiter = 0.0001111   # specific fuel consumption during loiter, 1/s
E_l2 = 1200            # endurance time for loiter at 5 - 6, s
W_crew = 800           # Weight of crew, lb
W1_W0 = 0.97           # Weight fraction during warm-up and take-off, W1/W0
W2_W1 = 0.985          # Weight fraction during climb, W2/W1
W7_W6 = 0.995          # Weight fraction during landing, W7/W6
# Other constants such as fuel allowance = 6%, A = 0.93, c = -0.07 and Kvc = 1.0 are quoted directly into the formulae when needed


# Function to calculating the weight fraction at cruise using the range equation
def cruise_func(R):
    return exp( -(R*C_cruise) / (L_D_cruise*V) )


# Function to calculating the weight fraction during loiter using the endurance equation
def loiter_func(E):
    return exp( -(E*C_loiter) / L_D_loiter)


# Function to calculate the take-off weight
def take_off_weight_func(W0_guess, payload, W7_W0):
    # Calculating the estimated take-off weight
    W0 = (W_crew + payload) / (1 - 1.06*(1 - W7_W0) - 0.93*W0_guess**-0.07 )


    # Calculating the absolute difference between the estimated take-off weight and the guessed take-off weight
    err = abs(W0 - W0_guess)


    # logically test to terminate recursion or continue.
    if err <= 10**-4:
        return W0
    
    else:
        # Taking the average
        Avg_W0 = (W0 + W0_guess)/2

        # recuring computation of the take-off weight
        return take_off_weight_func(Avg_W0, payload, W7_W0)
    

R = eval( input("Enter your cruise range (start, end, step): ") )  # ---- Accepting inputs for range of values
W_payload = eval( input("Enter your payload (start, end, step): ") )  # --- Accepting inputs for payload values


# Converting int and floats into list for future iterations.
if type(R) in [int, float]: R = [R]
if type(W_payload) in [int, float]: W_payload = [W_payload]


# Defining my x, y and z values as range, payload and take-off weight
x, y, z = ([], [], [])

# Varying the take-off weight with respect to a range of cruise range values.
for r in R:

    # calculating the weight fraction accross the entire mission profile.
    W7_W0 = W1_W0 * W2_W1 * cruise_func(r) * loiter_func(E_l1) * cruise_func(r) * loiter_func(E_l2) * W7_W6

    # Varying the take-off weight with respect to a range of payload values.
    for payload in W_payload:

        # Guessing the initial weight
        W0_guess = 50000 # 4 * (payload + W_crew)

        # Calculating W0
        W0 = take_off_weight_func(W0_guess, payload, W7_W0)

        # Saving the data in text files.
        x.append(r); y.append(payload); z.append(round(W0, 2))


# Displaying sample of the data computed

print("Range  Payload   Weight")
for i in range(len(z)):
    print(f"{x[i]:2d} {y[i]:2d} {z[i]:2.2f}")


# Visualization of data computed

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
