#include<reg51.h>
// we doing a digital clock that displays the time

sbit seg1=P1^0;
sbit seg2=P1^1;
sbit seg3=P1^2;
sbit seg4=P1^3;
unsigned int i;
void main ()
{
	//it uses the active high approach to work
seg1=seg2=seg3=seg4=0; 

while (1)
{
	//for seg1
	seg1=1;
	P2=0x61ff;
	for(i=0;i<2000;i++);
	seg1=0;

//for seg2
	seg2=1;
	P2=0x387f;
	for(i=0;i<2000;i++);
	seg2=0;

//for seg3
	seg3=1;
	P2=0x607f;
	for(i=0;i<2000;i++);
	seg3=0;

//for seg4
	seg4=1;
	P2=0x199af;
	for(i=0;i<2000;i++);
	seg4=0;

}

}