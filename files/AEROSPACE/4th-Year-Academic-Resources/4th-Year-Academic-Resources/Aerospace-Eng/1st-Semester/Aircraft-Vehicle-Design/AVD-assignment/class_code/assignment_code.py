from math import exp

# FUnction of calculating cruise:
def cruise(R):
    return exp(-(R*0.0001389)/(13.9 * 569.9))

# Function for calculating loiter:
def loiter(E):
    return exp(-(E*0.0001111)/16)

# SAVING ALL CONSTANTS VALUES
w1_w0 = 0.97
w2_w1 = 0.985
w7_w6 = 0.995
E1 = 10800
E2 = 1200
Wcrew = 800
W0_guess = 5000

# TAKING INPUTS OF RANGE AND PAYLOAD
R = eval(input("Enter the value or range of values for the aircrat range: "))
W_payload = eval(input("Enter the value or range of values for the aircraft payload: "))

# Calculaing for a range of values
for r in R:      # r = single range value and R = set of range vales.
    # calculating the weight fraction, W7_W0
    w7_w0 = w1_w0 * w2_w1 * cruise(r)**2 * loiter(E1) * loiter(E2) * w7_w6



