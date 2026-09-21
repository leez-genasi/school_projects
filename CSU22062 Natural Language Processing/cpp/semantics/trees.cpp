#include "trees.h"
#include <stdlib.h>
#include <iostream>

int Tree::node_count = 0;

/*! constructs Tree whose mother is not set just and has empty dtrs
 *
 * 
 */
Tree::Tree() {

}

/*! \param c is Category which will be mother in Tree
 *
 * dtrs is empty
 */
Tree::Tree(Category c) {
  mother = c;
  parent = NULL;
  dtr_index = 0;


}





/*! calls delete on the immediate daughter trees
 *
 * this causes each daughter's destructor to be run so that effect is to 
 * recursively delete all memory used in the representation of the tree
 */ 
Tree::~Tree(void) {
    for(unsigned int i = 0; i < dtrs.size(); i++) {
    delete dtrs[i];
    }
}


/*! \param m is Category which will be mother in Tree
 *  \param ds is desired vector of daughter Tree pointers
 */
Tree::Tree(Category m, vector<Tree *> ds) {
  mother = m;
  dtrs = ds;
}

void Tree::drawtree(void) {
  mother.print(); 
  cout << endl;
  drawdtrs(dtrs,"");
}

void Tree::drawdtrs(vector<Tree *> dtrs, string prefix) {
  string prefix1;
  unsigned int i;

  // if empty dtrs of a leaf do nothing 
  if (dtrs.size() == 0) {
    return;
  }

  // up to last dtr 
  for(i = 0; i < dtrs.size()-1; i++){
    prefix1 = prefix + "|___";
    cout << prefix1;
    dtrs[i]->mother.print(); 
    cout << endl;
    prefix1 = prefix + "|   ";
    drawdtrs(dtrs[i]->dtrs,prefix1);  
    cout << prefix1 << endl;
  }

  // last dtr
  prefix1 = prefix + "|___";
  cout << prefix1;
  dtrs[i]->mother.print(); 
  cout << endl;
  prefix1 = prefix + "    ";
  drawdtrs(dtrs[i]->dtrs,prefix1);  

}

void Tree::drawtree(Tree *p, int prefix) {
  printspaces(prefix);
  if(p->dtrs.size() == 0) {
    p->mother.print();
    cout << endl;
  }
  else {
    p->mother.print();
    cout << '/'; 
    cout << endl;
    for(unsigned int i = 0; i < p->dtrs.size(); i++){
      drawtree(p->dtrs[i], prefix + 3);
    }
  }

}

void Tree::printspaces(int n) {
  for (int i = 0; i < n; i++) {
    cout << ' ';
  }
}
// just show top level
void Tree::draw_just_top() {
  mother.print(); 

  unsigned int i;

  // if empty dtrs of a leaf do nothing 
  if (dtrs.size() == 0) {
    return;
  }
  else {
    cout << " --> ";
    for(i = 0; i < dtrs.size(); i++){
      dtrs[i]->mother.print(); 
      if(i != dtrs.size()-1) {
	cout << "," ;
      }
    }
  }
}

void Tree::dot_tree() {
  node_count = 0;
  ofstream f;
  // makes filename /tmp/bloggs_parse.dot
  // prints dot prologue
  string personal_parse(getenv("LOGNAME"));
  personal_parse = "/tmp/" + personal_parse + "_parse";
  string dot_file;
  dot_file = personal_parse + ".dot";
  f.open(dot_file);
  f << "digraph G {\n";
  f << "center=true;";
  // f << "size=\"10,10\";\n"; // use this to try to fix size
  // prints the tree internals in dot language 
  dot_tree(f);
  // print dot epilogue
  f << "}";
  f.close();
  // make /tmp/bloggs_parse.ps
  string dot_command;
  dot_command = "dot -Tps " + dot_file + " -o " + personal_parse + ".ps";
  system(dot_command.c_str());
  // show the postscript file
  string ghost_command;
  // temp fix for lab machine's which do not have their own gv
  // ghost_command = "/shared/teaching/CSLL/2CSLL3/IntelBin/gv " + personal_parse + ".ps";
  ghost_command = "gv " + personal_parse + ".ps";

  system(ghost_command.c_str());

}

void Tree::dot_tree(ostream& f) {
  int mother_count;
  f << node_count << endl;
  bool has_slash = false;
  if(mother.cat.find('/') != string::npos) { has_slash = true; }
  string node_label = "";
  if(has_slash) {
    node_label += " [color=red,";
  }
  else {
    node_label += " [";
  }
  node_label += " label=\"";
  node_label += mother.cat;
  node_label += "\"];";
  f << node_count << node_label << endl;
  //  f << node_count << " [label=\"" << mother.cat << "\"];" << endl;
  mother_count = node_count;
  for(unsigned int i = 0; i < dtrs.size();  i++) {
    node_count++;
    f << mother_count << " -> " << node_count << endl;
    dtrs[i]->dot_tree(f);
  }

}
