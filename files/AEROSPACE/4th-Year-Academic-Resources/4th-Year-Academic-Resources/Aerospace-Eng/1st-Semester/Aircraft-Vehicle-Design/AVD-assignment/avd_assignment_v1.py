from math import exp

# Function calculates the weight fraction of an unknown segmentation by specifying if it is cruise, c or loitering, l.
def weight_fraction_calc(data):
    try:
        # No need to calculate since the final value has been given
        return float(data)
    
    except:
        # decides which formulae to use for the calculations given that the user's input was "c" or "l".
        try:
            if data.lower() == "c":
                # Calculates the cruise weight fraction for that segment, Wx/Wx-1
                return round(exp(-(para["Range"] * para["Specific Fuel Capacity"]) / (para["Velocity"] * para["Lift-to-drag"])), 3)
            
            elif data.lower() == "l":
                # Calculates the loiter weight fraction for that segment, Wx/Wx-1
                return round(exp( -(para["Endurance"] * para["Specific Fuel Capacity"]) / (para["Lift-to-drag"]) ), 3)
        
        except:
            # Returns a prompt to indicate that there is an error in the calculations. The wasn't correct data to perform the choice of calculations.
            return "Calculations broke due to invalid air plane flight parameters!"

# Funtion calculate the fuel fraction, Wf/W0
def fuel_fraction_calc(wx: float, para: dict):
    return round((1 + para["Trapped / Fuel Allowance"]) * (1- wx), 3)


# Fucntion calculates an empty weight fraction, We/W0
# def empty_weight_fraction_calc():
#     print("Provide extra data: ")

# ---------------------------------------------------------------------------------------------------------------------------------------------------------#

# Collection of general flight operation conditions
print("Air plane flight parameters: ")
global para
para = {i: eval(input(f"{i} = ")) for i in ("Range", "Specific Fuel Capacity", "Velocity", "Lift-to-drag", "Trapped / Fuel Allowance", "Endurance", "A", "C", "Kvc")}


# Collecting mission profile fuel fraction data
w_prev = 1
num = int(input("Enter the number of segmentations of the mission profile\n>> "))
for i in range(num):
    w_new = weight_fraction_calc(input(f"Enter data or state [c - Cruise, l - loiter] of weight fraction, W{i+1}/W{i} = "))
    w_prev = w_prev*w_new   #----> Final Wx/Wx-1 = w_prev

# Making iterative guess until value converges
W_guessed = float(input("Enter a guessed initial take-off weight.\n>> "))

# while W_guessed
# I am yet to creat the next phase of the code. Where I am going to loop through the values until they converge below an allowed error of x10^(-4)


