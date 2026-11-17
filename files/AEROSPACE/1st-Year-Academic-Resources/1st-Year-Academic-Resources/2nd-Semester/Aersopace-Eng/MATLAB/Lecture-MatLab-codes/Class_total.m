% Write a matlab funtion that takes as input the number of students in a
% class and promts the user for the grades of the students. The program
% should calculate the total and average grades for the class.
clear
clc
n=input('please enter the number of students in the class: ');
if n<=0
    disp('error 404')
end
s=1; total=0;
while s<=n
grade = input('PLease enter the grade of the student: ');
total=total+grade;
s=s+1;
end
total;
average=total/n;
fprintf('The class has an average of %d\n',total)

