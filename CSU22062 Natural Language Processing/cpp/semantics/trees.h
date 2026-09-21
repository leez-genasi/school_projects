#include "rules.h"
#include <fstream>

using namespace std;

#if !defined TREE_H
#define TREE_H

//! a node in a syntax tree
class Tree {
 public:
  Category mother; //!< label of node in a tree
  vector<Tree *> dtrs; //!< the daughters of the node, each being a dynamically allocated Tree pointer
  Tree(void);
  ~Tree(void);
  Tree(Category c); //!< sets mother to c
  Tree(Category m, vector<Tree *> ds);
  // pertaining to drawing the output

  void drawtree(void); //!< shows the tree on standard output with standard ascii characters
  void draw_just_top(void); //!< shows the top-layer on standard output with standard ascii characters
  void dot_tree(void); //!< uses the dot program and ghostscript to show tree in graphical way
  void dot_tree(ostream& f); 
  static int node_count;

  // these parts used only in code to recover trees from Charts
  unsigned int dtr_index; //!< the position in a sequence of dtrs
  Tree *parent; //!< the tree above this one 

 private:
  void drawdtrs(vector<Tree *> dtrs, string prefix);
  void drawtree(Tree *t, int prefix); 
  void printspaces(int prefix);

};

#endif
