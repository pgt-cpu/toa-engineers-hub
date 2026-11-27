#include<reg51.h>
void main ()
{
unsigned int i;
P1 = 0x00; // declaring as output
while (1)
{
P1 = 0xff;  // turning on 
for(i=0;i<60000;i++);
P1 = 0x00;//turning off
for(i=0;i<60000;i++);
}
}