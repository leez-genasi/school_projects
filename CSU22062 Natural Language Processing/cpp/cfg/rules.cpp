
#include "rules.h"
#include <fstream>
#include <algorithm>
#include <iostream>

/*! checks equality of category names and terminal setting
 * 
 * so a terminal 'a' is different from a non-terminal 'a'
 */
bool are_equal(Category c1, Category c2) {
  if ((c1.cat == c2.cat) && (c1.terminal == c2.terminal)) {
    return true;}
  else {
    return false;
  }

}

bool Category::operator==(const Category& c) {
  if ((cat == c.cat) && (terminal == c.terminal)) {
    return true;
  }
  else {
    return false;
  }
}

/*! \param c string describing a category
 *
 * if c = [w] it is taken to be a terminal category and part between 
 * [ ] is the actually category name
 *
 * otherwise whole string is taken as category name
 */
Category::Category(string c) {

  if (c[0] == '[') {
    cat = c.substr(1,c.length() - 2); /* location of ] */
    terminal = true;
  }
  else {
    cat = c;
    terminal = false;
  }

}


Category::Category() {
#if DEBUG 
  cout << "calling void Category constructor\n";
#endif
}

Category::~Category() {
#if DEBUG
  cout << "calling category destructor\n";
#endif
}


void Category::print() {
  if (terminal) {
    cout << '[' + cat + ']';
  }
  else {
    // dont recall reason for space
    //    cout << cat << ' ';
    cout << cat;
  }
}

/*! \param r is string describing a rule
 *
 * r is of form 'm --> d1,...,dn'
 *
 * where m and the di are strings describing categories
 */
Rule::Rule(string r) {

  size_t sp_pos, i, start, len;
  start = 0;

  // erase white
  while ((sp_pos =  r.find(' ',start)) != string::npos) {
    r.erase(sp_pos,1);
    start = sp_pos;
  }


  i = r.find("-->");
  start = i + 3;
  mother = Category(r.substr(0,i));

  /* push all daughters up to last comma */
  while((i = r.find(",",start)) != string::npos) {
    len = i-start;     // length of current daughter 
    dtrs.push_back(Category(r.substr(start,len)));
    start = i + 1;
  }

  /* push last dtr */

  dtrs.push_back(Category(r.substr(start)));


}

Rule::Rule() {
#if DEBUG
  cout << "calling void Rule constructor\n";
#endif
}

Rule::~Rule() {
#if DEBUG
  cout << "calling Rule destructor\n";
#endif
}

void Rule::print() {
  mother.print(); 
  cout << " --> ";
  if(dtrs.size() == 0) { cout << "[]\n"; }
  else {
  for (unsigned int i=0; i<dtrs.size()-1; i++) {
    dtrs[i].print();
    cout << ",";
  }
  dtrs.back().print();
  cout << endl;
  }
}

/*!\param f names a file contain lines each of which is 
 *
 * either a rule like m --> d1, ... ,dn
 *
 * or initial(m) 
 *
 * or begins with % and is a commment
 *
 * or is empty
 */
Grammar::Grammar(string f) {
  ifstream file;
  file.open(f);
  unsigned int init_offset, init_length;
  
  string line;


  nrules = 0;

  while(getline(file,line)) {

    if (line.length() == 0) {} 
   
    else if(line[0] == '%') {}
  
    else if (line.find("-->") != string::npos) {
      Rule r(line);
      rules.push_back(r); 
      nrules++;
    }
    
    else if (line.find("initial") != string::npos) {
      init_offset = line.find('(')+1; 
      init_length = line.size() - init_offset - 1;
      initial = Category(line.substr(init_offset,init_length));
    }
       
  }
}
      


  

Grammar::Grammar(){
#if DEBUG
  cout << "calling void Grammar constructor\n";
#endif
}

Grammar::~Grammar() {
#if DEBUG
  cout << "calling Gramar destructor\n";
#endif
}

void Grammar::print() {
  for(unsigned int i = 0; i < nrules; i++) {
    cout << i << ":";
    rules[i].print();
  }
  cout << "initial is ";
  initial.print();
  cout << endl;
}



