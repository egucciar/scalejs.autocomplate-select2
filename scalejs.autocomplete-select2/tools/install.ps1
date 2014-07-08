param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.autocomplete-select2' : 'Scripts/scalejs.autocomplete-select2-$($package.Version)',
		'select2' : 'Scripts/select2'
	}" |
	Add-Shims "{
		'select2': {
			'deps' : [ 'jQuery' ]
		}
	}" |
	Add-ScalejsExtension 'scalejs.autocomplete-select2' |
	Out-Null