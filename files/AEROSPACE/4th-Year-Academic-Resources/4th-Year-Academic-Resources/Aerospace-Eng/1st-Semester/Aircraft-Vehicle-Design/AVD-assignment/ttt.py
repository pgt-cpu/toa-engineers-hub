import csv
import matplotlib.pyplot as plt
# import pandas as pd

fh = open("AVD_database.csv")
df = csv.reader(fh)
rows = list(df)


x, y, z = [], [], []
for row in rows:
    x.append(row[0])
    y.append(row[1])
    z.append(row[2])

fig = plt.figure()
ax = plt.axes(projection = "3d")
ax.plot3D(x, y, z)

plt.show()


# retrive data
# with open("AVD_database.csv", "r") as data_file:
#     data = csv.DictReader(data_file)

#     # creating lines
#     x = []
#     y = []
#     z = []
#     for i in data:
#         x.append(i["range"])
#         y.append(i["payload"])
#         z.append(i["W0"])

# data = pd.read_csv("AVD_database.csv")
# data.plot()

# fig = plt.figure()
# ax = plt.axes(projection = "3d")
# ax.plot3D([2, 4], [10, 50], [15, -100], "blue")
# ax.set_title("Trials")


plt.show()