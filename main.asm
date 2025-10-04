%macro read 2
mov eax , 3
mov ebx , 0
mov ecx , %1
mov edx , %2
int 80h
%endmacro

%macro write 2
mov eax , 4
mov ebx , 1
mov ecx , %1
mov edx , %2
int 80h
%endmacro
section .data 
msg : db "Enter a number: " 
msglen equ $-msg
msg1 : db "The number is: " 
msglen1 equ $-msg1

section .bss
buf resb 10

section .text 
 global _start
_start:

write msg, msglen
read buf, 2
write msg1, msglen1
write buf, 1


mov eax , 1
mov ebx , 0
int 80h

