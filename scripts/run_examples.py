# Executes every code sample shown in the video with the real interpreter and stores real output.
import json, subprocess, sys, tempfile, os, platform
EX = {
 "ex1": 'sales = 5000\norders = 120\nbranch = "Cairo"\n\nprint(sales)\nprint(orders)\nprint(branch)\n',
 "ex2": 'sales = 5000\nsales = 5500\n\nprint(sales)\n',
 "ex3_valid": 'total_sales = 5000\ncustomer_count = 120\nbranch_name = "Cairo"\n',
 "ex3_bad1": '2sales = 5000\n',
 "ex3_bad2": 'total sales = 5000\n',
 "ex4": 'orders = 120\nunit_price = 125.5\nproduct = "Laptop"\nis_available = True\n',
 "ex5": 'orders = 120\nunit_price = 125.5\nproduct = "Laptop"\nis_available = True\n\nprint(type(orders))\nprint(type(unit_price))\nprint(type(product))\nprint(type(is_available))\n',
 "ex6": 'quantity_text = "250"\n\nquantity_int = int(quantity_text)\nquantity_float = float(quantity_text)\nquantity_string = str(quantity_int)\n\nprint(quantity_int)\nprint(quantity_float)\nprint(quantity_string)\n',
 "ex7": 'city = "Cairo"\nnumber = int(city)\n',
 "ex8": 'print(int(25.9))\nprint(int(-5.9))\n',
 "s5": 'product = \'Laptop\'\ncity = "Alexandria"\ncustomer_code = "4501"\n',
 "s6": 'is_available = True\nis_delivered = False\n',
 "s10": 'product = "Laptop"\nquantity = 120\nunit_price = 125.5\nis_available = True\n\nprint(type(product))\nprint(type(quantity))\nprint(type(unit_price))\nprint(type(is_available))\n',
}
out={"python":platform.python_version(),"note":"Directory in tracebacks replaced by C:\\course (display only)","items":{}}
with tempfile.TemporaryDirectory() as d:
    for k,code in EX.items():
        p=os.path.join(d,"lesson05.py"); open(p,"w").write(code)
        r=subprocess.run([sys.executable,"lesson05.py"],cwd=d,capture_output=True,text=True)
        norm=lambda t:t.replace(os.path.join(d,"lesson05.py"),"C:\\course\\lesson05.py")
        out["items"][k]={"code":code,"stdout":r.stdout,"stderr":norm(r.stderr),"rc":r.returncode}
json.dump(out,open("src/data/outputs.json","w"),indent=1,ensure_ascii=False)
for k,v in out["items"].items(): print(k,v["rc"],repr(v["stdout"]),v["stderr"].replace("\n"," | "))
