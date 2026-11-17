import numpy as np
import matplotlib.pyplot as plt

W1_W0 = 0.97
W2_W1 = 0.985
W7_W6 = 0.995
Range_in_nm = np.linspace(1000, 10000, 10, dtype=np.complex128)
Range_in_ft = (Range_in_nm * 6076)
C_in_s = 0.0001389
V_in_miles = 0.6
V_in_ft_s = round(V_in_miles * 994.8, 1)
L_D = round(16 * 0.866, 1)
W_crew = 800  #lb
payload = eval(input("What is your payload?: "))
if type(payload) is int:
    payload = [payload]
W0_final = []

range = []
W0 = []


for distance in Range_in_ft:

    W_In_cruise = np.round(np.exp(-(distance * C_in_s) / (V_in_ft_s * L_D)), 3)
    W3_W2 = W_In_cruise
    W5_W4 = W_In_cruise
    # print(W3_W2)

    def loiter(E):
        E_in_s = np.round(E * 3600, 1)
        C = np.round(0.4 / 3600, 7)
        loiter_weight = np.round(np.exp(-(E_in_s * C) / L_D), 4)
        return loiter_weight

    W4_W3 = loiter(3)
    W6_W5 = loiter(1 / 3)
    W7_W0 = np.round((W1_W0 * W2_W1 * W3_W2 * W4_W3 * W5_W4 * W6_W5 * W7_W6), 3)
    Wf_W0 = np.round(1.06 * (1 - W7_W0), 3)

    for p in payload:
        Wcp = W_crew + p
        W0_guess = 4 * Wcp
        while True:
            W0calc = (Wcp / (1 - Wf_W0 - 0.93 * (W0_guess**-0.07)))
            err = abs(W0_guess - W0calc)

            if err <= 10**-4:
                range.append(distance)
                W0.append(W0calc)
                break
            else:
                W0_guess = (W0_guess + W0calc) / 2

print(range)
print(W0)




