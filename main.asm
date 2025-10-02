section .data 

msg : db "Hi World" 

section .text 

mov eax , 4
mov ebx , 1
mov ecx , msg
mov edx , 8
int 80h

mov eax , 1
mov ebx , 0
int 80h

