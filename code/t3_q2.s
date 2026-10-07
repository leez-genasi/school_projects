		AREA wk4, CODE, READONLY
		ENTRY
		
		;q3
bouncer	RN r6				; renames reg6 to the name 'bouncer'

		;q4
		MOV r11, #'R' 		; loads char R into r11
		
		;q5
coeffs	SPACE 1600			; reserved 40 words (40*4 bytes) of zeroed space, labelled coeffs
		
		; q2
		MOV r12, #2000 		; load 12 into reg12
		MOV r12, #0			; loads 0 into reg12
		
stop 	B stop
		END