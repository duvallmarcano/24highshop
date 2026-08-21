from pywebcopy import save_website

kwargs = {'project_name': 'site_dump'}
save_website(
    url='https://www.24high.com/',
    project_folder='c:\\Users\\Marcano\\Local Sites\\24highshop\\24highshop',
    **kwargs
)
