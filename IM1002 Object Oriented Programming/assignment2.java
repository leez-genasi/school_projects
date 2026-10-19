// -- TO DO --
// status of game: undo/redo button (ctrl+z [17 + 90] // ctrl+y [17 + 89])
//                 whose turn, how many moves left
//				


package proj2_charlette_karan;

import java.awt.*;
import java.awt.event.*;

import javax.swing.*;
import javax.swing.border.*;
import javax.swing.text.*;

import java.util.*;

public final class assignment2
{
	private static void print(JTextPane textpane,String html)
	{
		textpane.setContentType("text/html");
		textpane.setText(html);
	}
	private static JTextPane newtextdisplay()
	{
		JTextPane disp=new JTextPane();
		disp.setFocusable(false);	// make not focusable (and not editable)
		disp.setBackground(null);	// make transparent
		DefaultCaret caret=new DefaultCaret();
		caret.setUpdatePolicy(DefaultCaret.NEVER_UPDATE);
		disp.setCaret(caret);		// stop scrollpane from tracking the caret in (disp)
		return disp;
	}
	private final Dimension winsize=new Dimension(840,770);
	private final int cellwidth=49;
	private final int cellspacing=4;
	private final int statusheight=70;
	private final int dbgheight=35;
	private final int boxwidth=cellwidth+cellspacing;
	private final Dimension boxsize=new Dimension(boxwidth,boxwidth);
	private final Dimension cellsize=new Dimension(cellwidth,cellwidth);
	private final JFrame win=new JFrame();
	private final JPanel game=new JPanel();
	private final JPanel board=new JPanel();
	private final JPanel control=new JPanel();
	private final JTextField inputn=new JTextField(7);
	private final JTextPane status=newtextdisplay();
	private final JTextPane dbg=newtextdisplay();
	private JPanel[][] cells;
	private int[][] game_array;
	private ArrayList<int[]> hist;
	private int n=8;
	private int p,q;
	private int count=1;
	private int turn=1;
	private int undoCount = 0;
	int moveCountBlack = 0;
	int moveCountWhite = 0;
	public assignment2()
	{
		// Make window //
		win.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		win.setPreferredSize(winsize);
		// Make game in a scroll-pane //
		win.add(new JScrollPane(game));
		game.setFocusable(true);	// make (game) have the initial input focus
		game.setLayout(new GridBagLayout());
		GridBagConstraints gbc=new GridBagConstraints();
		gbc.ipadx=6;	// inner padding horizontal 3px on both sides
		gbc.ipady=6;	// inner padding vertical 3px on both sides
		gbc.gridx=1;	// grid position column 1
		gbc.gridy=1;	// grid position row 1
		// Add board //
		game.add(board,gbc);	// add (board) to (game) according to (gbc)
		gbc.gridy++;
		// Add control //
		control.setLayout(new GridBagLayout());
		{
			GridBagConstraints gbc2=new GridBagConstraints();
			gbc2.gridx=1;
			gbc2.gridy=1;
			
			// Input board size //
			control.add(new JLabel("Board size:   "),gbc2);
			gbc2.gridx++;
			inputn.setText(""+n);
			control.add(inputn,gbc2);
			gbc2.gridx++;
			
			// Space //
			control.add(new JLabel("   "),gbc2);
			gbc2.gridx++;
			// Go button //
			JButton go=new JButton("Go!");
			control.add(go,gbc2);
			gbc2.gridx++;
			go.addActionListener(
				new DefaultListener()
				{
					public void actionPerformed(ActionEvent e)
					{
						// Get board size //
						try { n=Integer.parseInt(inputn.getText()); } catch(NumberFormatException a) { }
						if ( n>5 ) init();
						else print(status, "Please pick a board size larger than 5!");
					}
				}
			);
			
			// Space //
			control.add(new JLabel("   "),gbc2);
			gbc2.gridx++;
			// Undo Button
			JButton undo=new JButton("Undo");
			control.add(undo, gbc2);
			gbc2.gridx++;
			undo.addActionListener(
				new DefaultListener()
				{
					public void actionPerformed(ActionEvent e)
					{
						undo(n, game_array);
					}
				}
			);
			
			// Space //
			control.add(new JLabel("   "),gbc2);
			gbc2.gridx++;
			
			// Redo Button //
			JButton redo=new JButton("Redo");
			control.add(redo, gbc2);
			gbc2.gridx++;
			redo.addActionListener(
					new DefaultListener()
					{
						public void actionPerformed(ActionEvent e)
						{
							redo(n, game_array);
						}
					}
				);
		}
		game.add(control,gbc);
		gbc.gridy++;
		// Add status //
		game.add(status,gbc);
		gbc.gridy++;
		// Add dbg //
		game.add(dbg,gbc);
		gbc.gridy++;
		// Display window //
		win.pack();	// packs the contents of (win)
		win.setVisible(true);

		// Init //
		init();
		
		// Remove focus on click outside the board and control //
		Toolkit.getDefaultToolkit().addAWTEventListener(
			new AWTEventListener()
			{
				public void eventDispatched(AWTEvent e)
				{
					if( e instanceof MouseEvent && e.getID()==MouseEvent.MOUSE_PRESSED )
					{
						Object src=e.getSource();
						if( src instanceof Component )
						{
							Component component=(Component)src;
							boolean clickboard=board.isAncestorOf(component);
							boolean clickcontrol=control.isAncestorOf(component);
							print(dbg,"clicked on "+(clickboard?"board":clickcontrol?"control":"something else"));
							if( clickboard || control.isAncestorOf(component) ) return;
							game.requestFocus();
						}
					}
				}
			}
		,AWTEvent.MOUSE_EVENT_MASK);
	}
	private void init()
	{
		// Make board //
		count=1;
		cells=new JPanel[n][n];
		game_array = new int[n][n]; // array of board
		hist = new ArrayList<int[]>();
		board.removeAll();
		board.setLayout(new GridBagLayout());
		board.setBackground(Color.black);
		GridBagConstraints gbc=new GridBagConstraints();
		gbc.ipadx=2;
		gbc.ipady=2;
		for(int a=0;a<n;a++) for(int s=0;s<n;s++)
		{
			// Make board cell //
			JPanel cell=new JPanel();
			cells[a][s]=cell;
			cell.setMinimumSize(cellsize);
			cell.setPreferredSize(cellsize);
			cell.setBackground(null);
			cell.setLayout(new GridBagLayout());
			JPanel box=new JPanel();
			box.setPreferredSize(boxsize);
			box.setLayout(new GridBagLayout());
			box.setBorder(new BevelBorder(BevelBorder.LOWERED));
			box.add(cell);	// put the (cell) into a bigger (box) to make cell spacing and borders
			gbc.gridx=s;
			gbc.gridy=a;
			board.add(box,gbc);
			box.setBackground( a%2==s%2 ? Color.blue : Color.orange );
			
			// Make mouse listener for board cell //
			final int x=a,y=s;	// needed because we cannot use (a),(s) inside the new DefaultListener
			box.addMouseListener(
				new DefaultListener()
				{
					public void mousePressed(MouseEvent e)
					{
						if( e.getButton()==1 ) // left mouse click
						{	
							if (undoCount>0	 ) {
								for (int i=hist.size()-1; undoCount!=0; i--) {
									hist.remove(i);
									undoCount--;
								}
							}
							
							turn = ((count == 1 || count%4 == 0 || (count-1)%4 == 0) ? 1 : 2);
								int check = moveCheck(x, y, n, game_array);
								if (game_array[x][y] == 0) {
									if (turn == 1) {
										if (check >=-1) {
											game_array[x][y] = 1;
										}
									}
									else if (turn == 2){
										if (check <= 1) {
											game_array[x][y] = -1;
										}
									}

									int[] temp = {x, y};
									hist.add(temp);
								}

							display(x, y, n, game_array);
							game.requestFocus();

							moveCountBlack = 0;
							moveCountWhite = 0;
							
							moveCount(n, game_array);
							
							print(status,"<div style='text-align: right;'>Moves Made: "+count+
									" Player Turn:"+turn+
									" Moved to ("+x+","+y+")."+
									" Number of Moves Left = "+(turn == 1 ? moveCountBlack : moveCountWhite)+"</div>");
							
							if (moveCountBlack == 0) {
								int cont=JOptionPane.showConfirmDialog(win,("Player 1 wins!"),"Game Over!",JOptionPane.YES_NO_OPTION);
								if( cont==JOptionPane.NO_OPTION ) win.dispose();
							}
							if (moveCountWhite == 0) {
								int cont=JOptionPane.showConfirmDialog(win,("Player 2 wins!"),"Game Over!",JOptionPane.YES_NO_OPTION);
								if( cont==JOptionPane.NO_OPTION ) win.dispose();
							}				
						}

						count++;

							if (moveCountBlack == 0) {
								int cont=JOptionPane.showConfirmDialog(win,("Player 1 Wins!"),"Game Over!",JOptionPane.YES_NO_OPTION);
								if( cont==JOptionPane.NO_OPTION ) win.dispose();
							}
							if (moveCountWhite == 0) {
								int cont=JOptionPane.showConfirmDialog(win,("Player 2 Wins!"),"Game Over!",JOptionPane.YES_NO_OPTION);
								if( cont==JOptionPane.NO_OPTION ) win.dispose();
							}
							if (count == n*n) {
								int cont=JOptionPane.showConfirmDialog(win,("Draw!"),"Game Over!",JOptionPane.YES_NO_OPTION);
								if( cont==JOptionPane.NO_OPTION ) win.dispose();
							}
					}
				}
			);
			// Make key listener //
			KeyboardFocusManager.getCurrentKeyboardFocusManager().addKeyEventDispatcher(
				new KeyEventDispatcher()
				{
					public boolean dispatchKeyEvent(KeyEvent e)
					{
						int code=e.getKeyCode();
						int mod=e.getModifiersEx();
						boolean ctrl=0<(mod&KeyEvent.CTRL_DOWN_MASK);
						if( e.getID()==KeyEvent.KEY_PRESSED ) {
							if (ctrl && (code==90)) undo(n, game_array);
							if (ctrl && (code==89)) redo(n, game_array);
							return true;
						}
						return false;
					}
				});
		}
		int boardwidth=board.getPreferredSize().width;
		// Resize status //
		status.setPreferredSize(new Dimension(boardwidth,statusheight));
		// Resize dbg //
		dbg.setPreferredSize(new Dimension(boardwidth,dbgheight));
		// Start the game //
		print(status,"<div style='text-align: center;'><b>Ready!</b><br>Press an arrow key or click a cell to <i>move</i>!</div>");
		game.requestFocus();	// to remove focus from form elements
	}
	private void display(int x,int y, int n, int[][] game)
	{	
		for (int p=0; p<n; p++) for (int q=0; q<n; q++) {
			cells[p][q].removeAll();
			if (game[p][q] == 1) cells[p][q].add(new JLabel("<html><div style='font-size: 42; color: #f0f;'>⬤</div></html>")); // p1 - pink
			else if (game[p][q] == -1) cells[p][q].add(new JLabel("<html><div style='font-size: 42; color: #000;'>⬤</div></html>")); // p2 - black
		}
		board.revalidate();
		board.repaint();
	}
	
	private int moveCheck(int x, int y, int n, int[][] game) {
		int check=0;
		for (int i=-1; i<2; i++) if ((x+i)>0 && (x+i)<n) {
			for (int j=-1; j<2; j++) if ((y+j)>0 && (y+j)<n) {
				if (i==0 && j==0) continue;
				check = check + game[x+i][y+j];
			}
		}	
		return check; // p1 dominate: check > 1 // p2 dominant: check < -1
	}

	private void moveCount(int n, int[][] game) { // doesn't work check why // check number of valid opponent moves left
	
		for (int x=0; x<n; x++) for (int y=0; y<n; y++) {
			if (game[x][y] == 0) {
				int check = moveCheck(x, y, n, game);
//				if (turn == 1) { if (check <= 1) moveCountBlack++; } // current turn 1 -> if opponent can put in box
//				if (turn == 2) { if (check >= -1) moveCountWhite++; }
				if (check <= 1) moveCountBlack++;  // current turn 1 -> if opponent can put in box
				if (check >= -1) moveCountWhite++;
			}
		}
	}
	
	private void undo(int n, int[][] game) {
		if (undoCount == hist.size()) {
			print(status, "No more moves to undo!");
		}
		else {
			int[] move = hist.get(hist.size()-1-undoCount);
			int x = move[0];
			int y = move[1];

			undoCount++;
			count--;
			
			game[x][y] = 0;
			cells[x][y].removeAll();
			board.revalidate();
			board.repaint();
		}
	}

	private void redo(int n, int[][] game) {
		if (undoCount == 0) print(status, "No more moves to redo!");
		else {
			int[] move = hist.get(hist.size()-undoCount);
			int x = move[0];
			int y = move[1];

			turn = ((count == 1 || count%4 == 0 || (count-1)%4 == 0) ? 1 : 2);

			game[x][y] = (turn == 1 ? 1 : -1);
			if (turn == 1) cells[x][y].add(new JLabel("<html><div style='font-size: 42; color: #f0f;'>⬤</div></html>"));
			else if (turn == 2) cells[x][y].add(new JLabel("<html><div style='font-size: 42; color: #000;'>⬤</div></html>"));
			board.revalidate();
			board.repaint();
			undoCount--;
			count++;
		}
	}
	

	
 	public static void main(String[] args)
	{
		SwingUtilities.invokeLater( new Runnable() { public void run() { new assignment2(); } } );
	}
}
